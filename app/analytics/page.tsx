import Dashboard from '@/component/Dashboard';
import { Divide } from 'lucide-react';
import React from 'react'
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/authOptions';
import { Session } from 'next-auth';

 const page = async () => {
  const session  = await getServerSession(authOptions);

      if(!session){
        redirect('/login');
      }

      const typedSession = session as Session;

  return (
    <div>
      
      <Dashboard />
    </div>
  )
}

export default page;
