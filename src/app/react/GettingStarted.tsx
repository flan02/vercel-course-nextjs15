'use client'
import { useState } from 'react';

type Props = {
  title?: string;
}
function Header({ title }: Props) {
  return <h1>{title ? title : 'Default title'}</h1>;
}

export const GettingStarted = () => {
  const names = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton'];

  const [likes, setLikes] = useState(0);

  function handleClick() {
    setLikes(likes + 1);
  }

  return (
    <div>
      <Header title="Develop. Preview. Ship." />
      <ul>
        {names.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>

      <button onClick={handleClick}>Like ({likes})</button>
    </div>
  );
}