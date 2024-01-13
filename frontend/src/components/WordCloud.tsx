"use client";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React from "react";
import D3WordCloud from "react-d3-cloud";

type Props = {
  // formattedTopics: { text: string; value: number }[];
};

const data = [
  {
    text: "Math",
    value: 30,
  },
  {
    text: "Science",
    value: 12,
  },
  {
    text: "History",
    value: 4,
  },
  {
    text: "English",
    value: 112,
  },
  {
    text: "Computer Science",
    value: 7,
  },
];

const fontSizeMapper = (word: { value: number }) =>
  Math.log2(word.value) * 5 + 16;

const WordCloud = ({}: Props) => {
  const theme = useTheme();
  const router = useRouter();
  return (
    <>
      <D3WordCloud
        data={data}
        height={550}
        font="Times"
        fontSize={fontSizeMapper}
        rotate={0}
        padding={10}
        fill={theme.theme === "dark" ? "white" : "black"}
        onWordClick={(e, d) => {
          router.push("/quiz?topic=" + d.text);
        }}
      />
    </>
  );
};

export default WordCloud;
