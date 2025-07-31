"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SUPPORTED_LANGUAGES } from "@/config/language";
import { profileFormSchema, ProfileFormValues } from "@/lib/schemas/user";
import { Github, Linkedin, Twitter } from "lucide-react";
import { toast } from "sonner";
import { updateProfile } from "../actions";

interface ProfileFormProps {
  userData: {
    email: string;
    firstName: string | null;
    lastName: string | null;
    headline: string | null;
    bio: string | null;
    websiteUrl: string | null;
    socialLinks: {
      github?: string | null;
      linkedin?: string | null;
      twitter?: string | null;
    } | null;
    settings?: { language?: string };
  };
}

export function ProfileForm({ userData }: ProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      headline: userData.headline || "",
      bio: userData.bio || "",
      language: userData.settings?.language || "en",
      websiteUrl: userData.websiteUrl || "",
      socialLinks: {
        github: userData.socialLinks?.github || "",
        linkedin: userData.socialLinks?.linkedin || "",
        twitter: userData.socialLinks?.twitter || "",
      },
    },
  });

  const { isDirty } = form.formState;

  async function onSubmit(values: ProfileFormValues) {
    startTransition(async () => {
      const result = await updateProfile(values);

      if (result?.error) {
        result.error;
        toast.error("Update Failed");
      } else {
        toast.success("Profile updated successfully!");
        router.refresh();

        form.reset(values);
      }
    });
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Account Settings</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="headline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Headline</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Senior Software Engineer"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about yourself"
                    className="resize-none"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="websiteUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://your-portfolio.com"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormLabel>Social Links</FormLabel>
            <FormField
              control={form.control}
              name="socialLinks.github"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Github className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <FormControl>
                      <Input
                        placeholder="https://github.com/username"
                        {...field}
                        value={field.value ?? ""}
                        className="pl-10"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="socialLinks.linkedin"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Linkedin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <FormControl>
                      <Input
                        placeholder="https://linkedin.com/in/username"
                        {...field}
                        value={field.value ?? ""}
                        className="pl-10"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="socialLinks.twitter"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Twitter className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <FormControl>
                      <Input
                        placeholder="https://twitter.com/username"
                        {...field}
                        value={field.value ?? ""}
                        className="pl-10"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending || !isDirty}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
