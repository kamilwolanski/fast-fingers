import { ChangeEvent, ReactNode, useMemo, useState } from "react";

const countAccuracy = (correctCount: number, totalCount: number) => {
  return totalCount === 0 ? 100 : Math.round((correctCount / totalCount) * 100);
};

export const useSentence = (sentence: string) => {
  const splittedSentence = useMemo(() => sentence.split(" "), [sentence]);

  const sentenceAsArray = useMemo(
    () =>
      splittedSentence.map((el, index) =>
        index === splittedSentence.length - 1 ? el : el + " "
      ),
    [splittedSentence]
  );

  const [value, setValue] = useState("");
  const [typedText, setTypedText] = useState("");
  const [error, setError] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

  const accuracy = countAccuracy(correctCount, totalCount);
  const finished = currentSentenceIndex >= sentenceAsArray.length;
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // backspace
    if (newValue.length < value.length) {
      setValue(newValue);
      return;
    }

    setValue(newValue);

    if (currentSentenceIndex >= sentenceAsArray.length) return;

    setTotalCount((prev) => prev + 1);

    const expected = sentenceAsArray[currentSentenceIndex];
    const charIndex = newValue.length - 1;
    const typedChar = newValue[charIndex];
    const expectedChar = expected[charIndex];

    if (typedChar === expectedChar) {
      setCorrectCount((prev) => prev + 1);
    }

    if (newValue === expected) {
      setTypedText((prev) => prev + expected);
      setValue("");
      setCurrentSentenceIndex((prev) => prev + 1);
      setError(false);
      return;
    }

    if (expected.startsWith(newValue)) {
      setError(false);
    } else {
      setError(true);
    }
  };

  const renderSentence = (): ReactNode => {
    return splittedSentence.map((word, index) => {
      const className =
        index < currentSentenceIndex
          ? "text-green-600"
          : index === currentSentenceIndex
          ? "underline"
          : "";

      return (
        <span key={index}>
          <span className={className}>{word}</span>
          {index < splittedSentence.length - 1 && " "}
        </span>
      );
    });
  };

  return {
    value,
    typedText,
    error,
    accuracy,
    finished,
    handleChange,
    renderSentence,
  };
};
