


// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";

// const handler = NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       httpOptions: {
//         timeout: 10000, // 10s instead of default 3.5s to prevent cold-start timeouts
//       },
//     }),

//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: {
//           label: "Email",
//           type: "email",
//         },
//         password: {
//           label: "Password",
//           type: "password",
//         },
//       },

//       async authorize(credentials) {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/sign_in`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ email: credentials.email, password: credentials.password }),
//           }
//         );

//         const user = await res.json();

//        // console.log("LOGIN RESPONSE:", user);

//         return res.ok ? user : null;
//       },
//     }),
//   ],

// callbacks: {
//   async jwt({ token, user, account }) {
//     // console.log("JWT CALLBACK");
//     // console.log("incoming token:", token);
//     // console.log("incoming user:", user);

//     // Google Login
//     if (account?.provider === "google") {
//       console.log("Google callback started");

//       // Use 127.0.0.1 instead of localhost to avoid slow IPv6 DNS resolution on Windows
//       const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000")
//         .replace("localhost", "127.0.0.1");

//       const MAX_RETRIES = 3;
//       for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
//         try {
//           console.log(`Rails OAuth attempt ${attempt}/${MAX_RETRIES}`);

//           const res = await fetch(
//             `${apiUrl}/api/v1/auth/oauth`,
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 provider: "google",
//                 uid: account.providerAccountId,
//                 email: user?.email,
//                 name: user?.name,
//                 avatar_url: user?.image,
//               }),
//             }
//           );

//           const data = await res.json();
//           console.log("Rails response:", data);

//           if (res.ok) {
//             token.jwt = data.token;
//             token.user = data.user;
//           }
//           break; // Success — exit retry loop
//         } catch (err) {
//           console.error(`OAuth API error (attempt ${attempt}/${MAX_RETRIES}):`, err.message);
//           if (attempt < MAX_RETRIES) {
//             // Wait 2 seconds before retrying
//             await new Promise((resolve) => setTimeout(resolve, 2000));
//           }
//         }
//       }
//     }

//     // Credentials Login
//     if (user?.token) {
//       console.log("Credentials login user:", user);

//       token.jwt = user.token;
//       token.user = user;
//     }

//     console.log("outgoing token:", token);

//     return token;
//   },

//   async session({ session, token }) {
//     console.log("SESSION CALLBACK");
//     console.log("token:", token);

//     session.jwt = token.jwt;

//     session.user = {
//       id: token.user?.id,
//       username: token.user?.username,
//       email: token.user?.email,
//       role: token.user?.role,
//       created_at: token.user?.created_at,
//       avatar_url: token.user?.avatar_url,
//     };

//     console.log("session:", session);

//     return session;
//   },
// }
// });

// export { handler as GET, handler as POST };