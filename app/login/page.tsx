"use client";
import { Spotlight } from "@/components/ui/spotlight";
import { useEffect, useState } from "react";
import { LoginFormDemo } from "./(AuthComponents)/LoginForm";
import { SignupFormDemo } from "./(AuthComponents)/SignupForm";
import { useUserStore } from "@/states/user.state";
import { useRouter } from "next/navigation";

const Home = () => {
  const [login, setLogin] = useState(true);
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (user != null && user._id != "") {
      router.push("/");
    }
  }, [user]);

  return (
    <div className="dark grid md:grid-cols-12 relative bg-black/[0.96] antialiased">
      <div className=" h-screen w-full flex items-center justify-center relative overflow-hidden col-span-8">
        <Spotlight
          className="top-[70px] left-20 md:left-60 md:top-20"
          fill="white"
        />
        <div className=" p-4 max-w-7xl mx-auto flex items-center justify-center flex-col z-10 w-full pt-20 md:pt-0 select-none">
          <h1 className="text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            Welcome to <br /> Hike.
          </h1>
          <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
            Connect with one other and socialize.
          </p>
        </div>
      </div>
      <div className="hidden h-full z-10 py-10 md:block col-span-4">
        {login ? (
          <LoginFormDemo setLogin={setLogin} />
        ) : (
          <SignupFormDemo setLogin={setLogin} />
        )}
      </div>
    </div>
  );
};

export default Home;
