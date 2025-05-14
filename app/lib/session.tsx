import { SessionOptions } from 'iron-session';

export const sessionOptions: SessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'auth_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production', // Set to true in production for HTTPS only
    httpOnly: true, // Prevent client-side JavaScript access
    sameSite: 'lax', // Protect against CSRF
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export interface SessionData {
    token?: string;
    fonction?: string;
  }


// import { SessionOptions } from "iron-session";

// export interface SessionData {
//   userId?:string;
//   username?:string;
//   img?:string;
//   isPro?:boolean
//   isBlocked?:boolean
//   isLoggedIn:boolean
// }

// export const defaultSession:SessionData = {
//   isLoggedIn:false
// }

// export const sessionOptions: SessionOptions ={
//   password: process.env.SECRET_KEY!,
//   cookieName: "lama-session",
//   cookieOptions:{
//     httpOnly:true,
//     secure: process.env.NODE_ENV === "production"
//   }
// }