import IdeasClient from "./client";
import { schoolData } from "./data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

export default function IdeasPage() {
  const logo = PlaceHolderImages.find((img) => img.id === "holy-writ-logo");

  return (
    <div className="min-h-screen w-full bg-background font-body p-4 sm:p-6 md:p-8">
      <header className="flex items-center justify-center mb-8 text-center">
        {logo && (
          <Image
            src={logo.imageUrl}
            alt={logo.description}
            width={64}
            height={64}
            className="hidden sm:block mr-4"
          />
        )}
        <div>
          <h1 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">
            HOLY WRIT HIGH SCHOOL AND JUNIOR COLLEGE
          </h1>
          <p className="text-xl text-primary font-semibold">
            Ideas Submission
          </p>
        </div>
      </header>
      <main className="container mx-auto max-w-4xl">
        <IdeasClient initialData={schoolData} />
      </main>
      <footer className="text-center mt-8 text-muted-foreground text-sm">
        <p>Developer: Deepak Kumar</p>
        <p>Robotics and AI • Advance Technology</p>
      </footer>
    </div>
  );
}
