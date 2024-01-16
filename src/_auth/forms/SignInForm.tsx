import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { signinValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import {
  useSignInAccountMutation,
} from "@/lib/react-query/queriesAndMutations";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";

const SignInForm = () => {
  const { mutateAsync: signInAccount, isPending: isSigningIn } =
    useSignInAccountMutation();

  const form = useForm<z.infer<typeof signinValidation>>({
    resolver: zodResolver(signinValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const { checkAuthUser } = useUserContext();
  async function onSubmit(values: z.infer<typeof signinValidation>) {

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });
    if (!session) {
      return toast({
        title: "Sign in failed",
      });
    }
    const isLoggedIn = await checkAuthUser();
    if (isLoggedIn) {
      form.reset();
      navigate("/");
    } else {
      console.log("Not logged in");
      return toast({ title: "Sign iN failed" });
    }
  }
  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Log into Acoount
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Welcome back , please enter your details
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input className="shad-input" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="shad-button_primary" type="submit">
            {isSigningIn ? (
              <div className="flex-center gap-2">
                <Loader /> Loading....
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Don't have an account{" "}
            <Link
              className="text-primary-500 text-small-semibold ml-1"
              to="/sign-up"
            >
              Sign up
            </Link>{" "}
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignInForm;
