import { CSSProperties, Fragment } from 'react';

type SplitWordsProps = {
  text: string;
};

export const SplitWords = ({ text }: SplitWordsProps) => {
  const words = text.split(' ');

  return (
    <span aria-hidden="true">
      {words.map((word, index) => (
        <Fragment key={`${index}-${word}`}>
          <span className="hero-word-mask">
            <span className="hero-word" style={{ '--word-index': index } as CSSProperties}>
              {word}
            </span>
          </span>
          {index < words.length - 1 && ' '}
        </Fragment>
      ))}
    </span>
  );
};
