"use client";
import React, { useState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface SignupFormDemoInterface {
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SignupFormDemo: React.FC<SignupFormDemoInterface> = ({
  setLogin,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const changeLogin = () => {
    setLogin(true);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onRegister = async (data: any) => {
    try {
      setLoading(true);
      const url = process.env.NEXT_PUBLIC_BASE_URL;
      console.log(data);
      const res = await axios.post(`${url}/auth/register`, { ...data });
      console.log(res.data);

      if (res?.data?.error == false) {
        toast({
          title: res.data.message,
          description: `Congrats! Welcomee to Hike ${res.data.newUser.name}`,
        });
        setLogin(true);
      } else {
        toast({
          variant: "destructive",
          title: "Registration Issue",
          description: `Error: ${res.data.message}`,
        });
      }
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: `Error: ${error.response.data.message}!`,
      });
    } finally {
      setLoading(false);
    }
  };

  const errorMessages = {
    username: errors?.username?.message,
    email: errors?.email?.message,
    password: errors?.password?.message,
  };

  return (
    <div className="max-w-md h-full flex flex-col justify-center w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black/[0.96] antialiased">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to Hike
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Signup to Hike if you can because we don&apos;t have a login flow yet
      </p>

      <form className="my-8" onSubmit={handleSubmit(onRegister)}>
        {[
          {
            inputName: "username",
            inputLabel: "Username",
            inputType: "text",
            inputPlaceholder: "James Dunkan",
          },
          {
            inputName: "email",
            inputLabel: "Email",
            inputType: "email",
            inputPlaceholder: "almightyGenius23@gmail.com",
          },
          {
            inputName: "password",
            inputLabel: "Password",
            inputType: "password",
            inputPlaceholder: "••••••••",
          },
        ].map((item, i) => (
          <div key={i}>
            <LabelInputContainer className="mb-[18px]">
              <div className="flex items-center justify-between w-full">
                <Label htmlFor={item.inputName}>{item.inputLabel}</Label>
                {/* @ts-ignore */}
                {errorMessages[item.inputName] && (
                  <span className="text-red-300 text-sm font-semibold">
                    {/* @ts-ignore */}
                    {errorMessages[item.inputName]}
                  </span>
                )}
              </div>
              <Input
                id={item.inputName}
                placeholder={item.inputPlaceholder}
                type={item.inputType}
                {...register(item.inputName, {
                  required: {
                    value: true,
                    message: "Required",
                  },
                  minLength: {
                    value: 3,
                    message: "Minimum 3 characters required",
                  },
                  maxLength: {
                    value: 30,
                    message: "Maximum length 30",
                  },
                })}
              />
            </LabelInputContainer>
          </div>
        ))}

        <button
          className={`bg-gradient-to-br relative group/btn from-black ${
            loading
              ? "dark:from-gray-800 dark:to-zinc-400"
              : "dark:from-zinc-800 dark:to-zinc-900"
          }  to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]`}
          type="submit"
        >
          {!loading ? <span>Register &rarr;</span> : "Registering..."}

          <BottomGradient />
        </button>

        <p className="text-neutral-600 text-sm max-w-sm pt-4 dark:text-neutral-300 text-center">
          Already have an Account? Login{" "}
          <span
            onClick={changeLogin}
            className="dark:text-neutral-100 underline hover:cursor-pointer hover:no-underline"
          >
            here
          </span>
        </p>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-5 h-[2px] w-full" />

        <div className="flex items-center gap-2 justify-center">
          <button
            className=" relative group/btn flex space-x-2 items-center justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              GitHub
            </span>
            <BottomGradient />
          </button>
          <button
            className=" relative group/btn flex space-x-2 items-center justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Google
            </span>
            <BottomGradient />
          </button>
        </div>
      </form>
    </div>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
