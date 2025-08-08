import React from 'react';
import { Link } from 'react-router';
import { ArrowRight } from "lucide-react";

function Page404() {
    return (
        <div className='flex flex-col gap-4 w-full min-h-screen h-full justify-center items-center pt-20 pb-10 px-4 md:px-10'>
            <h1 className="text-9xl text-red-700 text-center font-bold">404</h1>
            <Link className="bg-red-700 text-white hover:bg-red-600 font-bold px-6 py-3 flex gap-1 justify-center items-center rounded-2xl" to="/">
                Go to Homepage <ArrowRight size={20} />
            </Link>
        </div>
    );
}

export default Page404;