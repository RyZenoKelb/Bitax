import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { verifyMessage } from "ethers/lib/utils";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login", // Redirection en cas d'erreur d'auth
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      // Assurez-vous d'avoir ces variables dans votre .env
    }),
    CredentialsProvider({
      name: "Email", // Login traditionnel par email
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          isPremium: user.isPremium,
        };
      },
    }),
    CredentialsProvider({
      id: "wallet", // Login avec wallet crypto
      name: "Wallet",
      credentials: {
        address: { label: "Adresse", type: "text" },
        message: { label: "Message", type: "text" }, // Message à signer
        signature: { label: "Signature", type: "text" }, // Signature du message
      },
      async authorize(credentials) {
        if (!credentials?.address || !credentials?.message || !credentials?.signature) {
          return null;
        }

        try {
          // Vérifier la signature avec ethers.js
          const address = verifyMessage(credentials.message, credentials.signature);
          
          // Vérifier que l'adresse vérifiée correspond à l'adresse fournie
          if (address.toLowerCase() !== credentials.address.toLowerCase()) {
            return null;
          }

          // Trouver le wallet et l'utilisateur associé
          const wallet = await prisma.wallet.findFirst({
            where: {
              address: credentials.address,
            },
            include: {
              user: true,
            },
          });

          // Si le wallet n'existe pas ou n'est pas associé à un utilisateur
          if (!wallet || !wallet.user) {
            // Option 1: Refuser la connexion
            return null;
            
            // Option 2: Créer automatiquement un compte (décommenter si souhaité)
            /*
            const newUser = await prisma.user.create({
              data: {
                wallets: {
                  create: {
                    address: credentials.address,
                    network: "eth", // Par défaut
                    isPrimary: true,
                  },
                },
              },
            });
            
            return {
              id: newUser.id,
              name: `Wallet ${credentials.address.substring(0, 6)}...${credentials.address.substring(38)}`,
              isPremium: false,
            };
            */
          }

          return {
            id: wallet.user.id,
            email: wallet.user.email,
            name: wallet.user.name,
            image: wallet.user.image,
            isPremium: wallet.user.isPremium,
          };
        } catch (error) {
          console.error("Erreur d'authentification wallet:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture as string | null;
        session.user.isPremium = token.isPremium as boolean;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.isPremium = (user as any).isPremium || false;
      }

      // Mise à jour du token lors d'une modification de profil
      if (trigger === "update" && session) {
        token.name = session.user.name;
        token.email = session.user.email;
        token.picture = session.user.image;
        token.isPremium = session.user.isPremium;
      }

      // Vérifie si l'abonnement premium est toujours valide
      if (token.id) {
        try {
          const subscription = await prisma.subscription.findFirst({
            where: {
              userId: token.id as string,
              plan: "premium",
              endDate: {
                gt: new Date(), // Abonnement non expiré
              },
            },
          });
          
          token.isPremium = !!subscription;
        } catch (error) {
          console.error("Erreur lors de la vérification de l'abonnement:", error);
        }
      }

      return token;
    },
  },
};