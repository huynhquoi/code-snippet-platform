"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Code2, LogOut, User, FileText, Menu, Home, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Link } from "@/i18n/routing";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function Navbar() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations("nav");
  const tAuth = useTranslations("auth");

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success(tAuth("loggedOut"));
      router.push("/login");
    } catch (error) {
      toast.error(tAuth("logoutFailed"));
      console.error("Error logging out:", error);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Code2 className="w-6 h-6" />
            <span className="hidden sm:inline">CodeSnippet</span>
            <span className="sm:hidden">CS</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm hover:text-primary transition-colors"
            >
              {t("home")}
            </Link>
            <Link
              href="/tags"
              className="text-sm hover:text-primary transition-colors"
            >
              {t("tags")}
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <ThemeSwitcher />

            <LanguageSwitcher />

            {loading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <Button asChild variant="default" size="sm">
                  <Link href="/snippets/new">
                    <FileText className="w-4 h-4 mr-2" />
                    {t("newSnippet")}
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user.displayName?.[0]?.toUpperCase() ||
                            user.email?.[0]?.toUpperCase() ||
                            "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/profile/${user.username}`}
                        className="cursor-pointer"
                      >
                        <User className="mr-2 h-4 w-4" />
                        {t("profile")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/snippets?my=true" className="cursor-pointer">
                        <FileText className="mr-2 h-4 w-4" />
                        {t("mySnippets")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {t("logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">{t("login")}</Link>
                </Button>
                <Button asChild variant="default" size="sm">
                  <Link href="/register">{t("register")}</Link>
                </Button>
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher />

            {loading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {user.displayName?.[0]?.toUpperCase() ||
                            user.email?.[0]?.toUpperCase() ||
                            "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/profile/${user.username}`}
                        className="cursor-pointer"
                      >
                        <User className="mr-2 h-4 w-4" />
                        {t("profile")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/snippets?my=true" className="cursor-pointer">
                        <FileText className="mr-2 h-4 w-4" />
                        {t("mySnippets")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {t("logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="px-6">
                    <SheetHeader>
                      <SheetTitle>{t("menu")}</SheetTitle>
                    </SheetHeader>
                    <nav className="flex flex-col gap-4 mt-6">
                      <Link
                        href="/"
                        className="flex items-center gap-3 text-lg hover:text-primary transition-colors"
                        onClick={closeMobileMenu}
                      >
                        <Home className="w-5 h-5" />
                        {t("home")}
                      </Link>
                      <Link
                        href="/tags"
                        className="flex items-center gap-3 text-lg hover:text-primary transition-colors"
                        onClick={closeMobileMenu}
                      >
                        <Tag className="w-5 h-5" />
                        {t("tags")}
                      </Link>
                      <div className="my-4 border-t" />
                      <Button
                        asChild
                        className="justify-start"
                        onClick={closeMobileMenu}
                      >
                        <Link href="/snippets/new">
                          <FileText className="w-5 h-5 mr-3" />
                          {t("newSnippet")}
                        </Link>
                      </Button>
                    </nav>
                  </SheetContent>
                </Sheet>
              </>
            ) : (
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="px-6">
                  <SheetHeader>
                    <SheetTitle>{t("menu")}</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-4 mt-6">
                    <Link
                      href="/"
                      className="flex items-center gap-3 text-lg hover:text-primary transition-colors"
                      onClick={closeMobileMenu}
                    >
                      <Home className="w-5 h-5" />
                      {t("home")}
                    </Link>
                    <Link
                      href="/tags"
                      className="flex items-center gap-3 text-lg hover:text-primary transition-colors"
                      onClick={closeMobileMenu}
                    >
                      <Tag className="w-5 h-5" />
                      {t("tags")}
                    </Link>
                    <div className="my-4 border-t" />
                    <Button asChild onClick={closeMobileMenu}>
                      <Link href="/login">{t("login")}</Link>
                    </Button>
                    <Button asChild variant="outline" onClick={closeMobileMenu}>
                      <Link href="/register">{t("register")}</Link>
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
