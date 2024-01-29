"use client";
import { quizzSchema } from "@/schemas/form/quizz";
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { BookOpen, CopyCheck } from "lucide-react";
import { Separator } from "./ui/separator";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoadingQuestions from "./LoadingQuestions";
import { useSession } from "next-auth/react";
import Head from "next/head";



type Input = z.infer<typeof quizzSchema>;

const QuizCreation = () => {
  const router = useRouter();
  const [showLoader, setShowLoader] = React.useState(false);
  const [finishedLoading, setFinishedLoading] = React.useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { mutate: getQuestions } = useMutation({
    mutationFn: async ({ amount, topic, type }: Input) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/game`,
        { amount, topic, type, userId }
      );
      return response.data;
    },
  });
  const form = useForm<Input>({
    resolver: zodResolver(quizzSchema),
    defaultValues: {
      // topic: "topicParam",
      type: "mcq",
      amount: 5,
    },
  });

  const onSubmit = async (data: Input) => {
    if (data.type !== "mcq") {
      toast({
        title: "Open-ended questions are temporary unavailable at the momment",
        description: "There are a lot of bugs to fix.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }
    setShowLoader(true);
    getQuestions(data, {
      onError: (error) => {
        setShowLoader(false);
        if (error instanceof AxiosError) {
          if (error.response?.status === 500) {
            toast({
              title: "Error",
              description: "Something went wrong. Please try again later.",
              variant: "destructive",
            });
          }
        }
      },
      onSuccess: ({ gameId }: { gameId: string }) => {
        setFinishedLoading(true);
        setTimeout(() => {
          if (form.getValues("type") === "mcq") {
            router.push(`/play/mcq/${gameId}`);
          } else if (form.getValues("type") === "open_ended") {
            router.push(`/play/open-ended/${gameId}`);
          }
        }, 2000);
      },
    });
  };
  form.watch();

  if (showLoader) {
    return <LoadingQuestions finished={finishedLoading} />;
  }

  return (
    <>
      <div className="inset-0 flex items-center justify-center p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Quiz Creation</CardTitle>
            <CardDescription>Choose a topic</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a topic" {...field} />
                      </FormControl>
                      <FormDescription>
                        Please provide any topic you would like to be quizzed on
                        here.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Questions</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="How many questions?"
                          type="number"
                          {...field}
                          onChange={(e) => {
                            form.setValue("amount", parseInt(e.target.value));
                          }}
                          min={1}
                          max={20}
                        />
                      </FormControl>
                      <FormDescription>
                        You can choose how many questions you would like to be
                        quizzed on here.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button
                    variant={
                      form.getValues("type") === "mcq" ? "default" : "secondary"
                    }
                    className="w-1/2 rounded-none rounded-l-lg"
                    onClick={() => {
                      form.setValue("type", "mcq");
                    }}
                    type="button"
                  >
                    <CopyCheck className="w-4 h-4 mr-2" /> Multiple Choice
                  </Button>
                  <Separator orientation="vertical" />
                  <Button
                    variant={
                      form.getValues("type") === "open_ended"
                        ? "default"
                        : "secondary"
                    }
                    className="w-1/2 rounded-none rounded-r-lg"
                    onClick={() => form.setValue("type", "open_ended")}
                    type="button"
                  >
                    <BookOpen className="w-4 h-4 mr-2" /> Open Ended
                  </Button>
                </div>
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default QuizCreation;
