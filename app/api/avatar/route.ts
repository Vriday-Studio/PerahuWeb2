import { NextResponse } from 'next/server'
import data from './assets.json'

export async function GET(request: Request) {
  return NextResponse.json(data)
}
