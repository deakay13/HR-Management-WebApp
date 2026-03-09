import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";

const signInSchema = z.object({
  TenTaiKhoan: z
    .string()
    .min(5, "Tài Khoản đăng nhập phải có ít nhất 5 ký tự")
    .max(50, "Tài khoản đăng nhập không quá 50 ký tự")
    .regex(/^[a-zA-Z0-9._]+$/, "Chỉ cho phép chữ, số, dấu chấm và gạch dưới"),
  MatKhau: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .regex(/[A-Z]/, "Phải có ít nhất một chữ hoa")
    .regex(/[a-z]/, "Phải có ít nhất một chữ thường")
    .regex(/[0-9]/, "Phải có ít nhất một chữ số")
    .regex(/[@#$%!^&*]/, "Phải có ít nhất một ký tự đặc biệt"),
});

type signInFormValues = z.infer<typeof signInSchema>;

export function SignInFrom({ className, ...props }: React.ComponentProps<"div">) {
  const { signIn } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<signInFormValues>({
    resolver: zodResolver(signInSchema),
  });
  const onSubmit = async (data: signInFormValues) => {
    const { TenTaiKhoan, MatKhau } = data;
    await signIn(TenTaiKhoan, MatKhau);
    navigate("/DashBoard");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Sign In</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="UserName">User Name</FieldLabel>
                <Input id="UserName" {...register("TenTaiKhoan")} />
                {errors.TenTaiKhoan && (
                  <p className="text-destructive text-sm">
                    {errors.TenTaiKhoan.message}
                  </p>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" {...register("MatKhau")} />
                {errors.MatKhau && (
                  <p className="text-destructive text-sm">
                    {errors.MatKhau.message}
                  </p>
                )}
              </Field>
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  Login
                </Button>
              </Field>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholderSignUp.png"
              alt="Image"
              className="absolute top-1/2 -translate-y-1/2 object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
