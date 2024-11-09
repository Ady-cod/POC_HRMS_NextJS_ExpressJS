// Home Page
import React from 'react'
import Link from 'next/link'

const page = () => {
  return (
    <div>
      <div className="flex justify-between p-12 pt-8 border border-red-500">
        <div className="font-bold text-5xl">Good Afternoon, HR!</div>
        <div className="pt-4">Connect to  
        <Link href="#">
          <img src="/images/slack.png"></img>
        </Link>
        <Link href="#">
          <img src="/images/trello.png"></img>
        </Link>
        </div>
      </div>
    </div>
  )
}

export default page
