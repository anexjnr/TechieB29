import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z
    .string()
    .min(1, "Message is required")
    .refine((v) => v.trim().split(/\s+/).filter(Boolean).length <= 300, {
      message: "Message must be at most 300 words",
    }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const messageValue = watch("message") || "";
  const wordCount = messageValue.trim().length
    ? messageValue.trim().split(/\s+/).filter(Boolean).length
    : 0;

  async function onSubmit(data: ContactFormValues) {
    try {
      const resp = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await resp.json();
      if (resp.ok && json.ok) {
        toast.success("Message sent — we will get back to you soon.");
        reset();
      } else {
        toast.error(json.error || "Failed to send message");
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to send message");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-primary/20 bg-black/10 p-6 space-y-4"
    >
      <div>
        <label className="text-sm font-semibold">Name</label>
        <input
          {...register("name")}
          className={`mt-1 w-full rounded-md bg-transparent border px-3 py-2 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
            errors.name ? "border-red-500" : "border-primary/30"
          }`}
          placeholder="Jane Doe"
          aria-invalid={errors.name ? "true" : "false"}
        />
        {errors.name && (
          <div className="text-sm text-red-400 mt-1">{errors.name.message}</div>
        )}
      </div>

      <div>
        <label className="text-sm font-semibold">Email</label>
        <input
          {...register("email")}
          type="email"
          className={`mt-1 w-full rounded-md bg-transparent border px-3 py-2 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
            errors.email ? "border-red-500" : "border-primary/30"
          }`}
          placeholder="jane@acme.com"
          aria-invalid={errors.email ? "true" : "false"}
        />
        {errors.email && (
          <div className="text-sm text-red-400 mt-1">
            {errors.email.message}
          </div>
        )}
      </div>

      <div>
        <label className="text-sm font-semibold">Message</label>
        <textarea
          {...register("message")}
          rows={6}
          className={`mt-1 w-full rounded-md bg-transparent border px-3 py-2 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
            errors.message ? "border-red-500" : "border-primary/30"
          }`}
          placeholder="How can we help? (max 300 words)"
          aria-invalid={errors.message ? "true" : "false"}
        />
        <div className="flex items-center justify-between mt-1 text-xs text-primary/70">
          {errors.message ? (
            <div className="text-red-400">{errors.message.message}</div>
          ) : (
            <div />
          )}
          <div>{wordCount} / 300 words</div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex justify-center w-full sm:w-auto items-center rounded-md border border-primary/30 bg-transparent px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-primary/10"
      >
        {isSubmitting ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
