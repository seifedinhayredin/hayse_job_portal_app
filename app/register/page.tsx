
import RegisterForm from '@/component/RegisterForm'
import React from 'react'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../api/auth/[...nextauth]/route'

 const page = async () => {
  const session = await getServerSession(authOptions)
  if(session) redirect("/login");
  return (
    <div><RegisterForm /></div>
  )
}
export default page;