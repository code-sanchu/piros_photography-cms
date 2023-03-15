import { useState, useRef } from "react";

import TextInput from "~/components/forms/TextInput";
import WithTooltip from "~/components/data-display/WithTooltip";

export const TextInputForm = ({
  initialValue = "",
  onSubmit,
  tooltipText,
  placeholder = "Write here",
}: {
  initialValue?: string;
  onSubmit: ({
    inputValue,
    onSuccess,
  }: {
    inputValue: string;
    onSuccess: () => void;
  }) => void;
  tooltipText: string;
  placeholder?: string;
}) => {
  const [inputIsFocused, setInputIsFocused] = useState(false);

  const [inputValue, setInputValue] = useState(initialValue);

  const prevValueRef = useRef(inputValue);
  const prevValueValue = prevValueRef.current;
  const isChange = prevValueValue !== inputValue;

  const handleSubmit = () => {
    if (!isChange) {
      return;
    }

    onSubmit({
      inputValue,
      onSuccess: () => {
        prevValueRef.current = inputValue;
      },
    });
  };

  const containerRef = useRef<HTMLFormElement>(null);

  return (
    <WithTooltip
      text={tooltipText}
      isDisabled={inputIsFocused}
      placement="auto-start"
    >
      <form
        className="relative"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        ref={containerRef}
      >
        <div className="form-control w-full max-w-xs">
          <TextInput
            setValue={(value) => setInputValue(value)}
            value={inputValue}
            placeholder={placeholder}
            showPressEnter
            isChange={isChange}
            onBlur={() => setInputIsFocused(false)}
            onFocus={() => setInputIsFocused(true)}
          />
        </div>
      </form>
    </WithTooltip>
  );
};