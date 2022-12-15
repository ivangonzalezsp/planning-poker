import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(req: any) {
  req.rawBody = "";
  console.log(req.body);
  return NextResponse.next();
}
