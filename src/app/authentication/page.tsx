import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SignInForm from "./components/sign-in-form";
import SignUpForm from "./components/sign-up-form";

export default function Authentication() {
  return (
    <div className="mx-auto max-w-[1920px] px-5 py-10 md:px-10 xl:px-16 2xl:px-20">
      <div className="flex min-h-[600px] lg:gap-8 xl:gap-12">
        <div className="hidden flex-col items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 p-8 text-white lg:flex lg:w-1/2">
          <div className="max-w-md space-y-4 text-center">
            <h1 className="text-3xl font-bold">Bem-vindo à Bewear</h1>
            <p className="text-lg text-purple-100">
              Descubra as melhores peças de roupa com estilo e qualidade únicos.
            </p>
            <div className="space-y-3 text-purple-100">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-white"></div>
                <span>Coleções exclusivas</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-white"></div>
                <span>Qualidade premium</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-white"></div>
                <span>Entrega rápida</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-center lg:w-1/2">
          <div className="w-full max-w-md">
            <Tabs defaultValue="sign-in">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                <TabsTrigger
                  value="sign-in"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  Entrar
                </TabsTrigger>
                <TabsTrigger
                  value="sign-up"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  Criar conta
                </TabsTrigger>
              </TabsList>
              <TabsContent value="sign-in" className="mt-4 w-full">
                <SignInForm />
              </TabsContent>
              <TabsContent value="sign-up" className="mt-4 w-full">
                <SignUpForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
