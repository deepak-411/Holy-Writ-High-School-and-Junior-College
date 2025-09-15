"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import * as Tone from "tone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight } from "lucide-react";

export default function WelcomePage() {
  const logo = PlaceHolderImages.find((img) => img.id === "holy-writ-logo");
  const background = PlaceHolderImages.find((img) => img.id === "holy-writ-background");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const playSoundAndSpeak = async () => {
      try {
        await Tone.start();
        const synth = new Tone.Synth().toDestination();
        synth.triggerAttackRelease("C4", "8n");
        
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance("Welcome to Holy Writ High School and Junior College");
          utterance.rate = 0.9;
          window.speechSynthesis.speak(utterance);
        }
      } catch (error) {
        console.error("Audio or speech could not be started. User interaction might be needed.", error);
      }
    };

    const timer = setTimeout(playSoundAndSpeak, 500);

    return () => {
      clearTimeout(timer);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isClient]);

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center p-4">
      {background && (
        <Image
          src={background.imageUrl}
          alt={background.description}
          fill
          className="object-cover z-0"
          data-ai-hint={background.imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/50 z-10" />
      
      <Card className="z-20 w-full max-w-md text-center bg-background/80 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="items-center">
          {logo && (
            <Image
              src={logo.imageUrl}
              alt={logo.description}
              width={128}
              height={128}
              className="rounded-full mb-4"
              data-ai-hint={logo.imageHint}
            />
          )}
          <h1 className="font-headline text-3xl font-bold text-primary-foreground">
            Welcome to
          </h1>
          <p className="font-headline text-2xl font-semibold text-primary-foreground/90">
            Holy Writ High School and Junior College
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Submit your innovative ideas and projects.
          </p>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 w-full transition-transform transform hover:scale-105">
            <Link href="/ideas">
              Enter
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
