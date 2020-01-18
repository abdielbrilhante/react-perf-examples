import React from 'react';

const content = [
  {
    content: (
      <div className="front">
        <h1>Memoização e performance em componentes e hooks</h1>
        <h3>Abdiel Brilhante</h3>
        <h4>Oowlish Technology (JS/React)</h4>
        <a href="https://github.com/abdielbrilhante/react-perf-examples">
          https://github.com/abdielbrilhante/react-perf-examples
        </a>
      </div>
    ),
  },
  {
    title: 'Onde estão os problemas de performance? 🤔',
    items: [
      'Renderizações desnecessárias?',
      'Atualizações do DOM?',
      'Funções "caras"?',
      'Quantidade de nós no DOM?',
    ],
  },
  {
    title: 'Renderização de componentes',
    items: [
      '(state, props) => View',
      'React propaga as mudanças de estado',
      'Atualização == Chamada de função(ões)',
    ],
  },
  {
    title: 'Problemas durante a atualização de componentes',
    items: [
      'Renderização demorada',
      'Rerenderizações desnecessárias',
      'Rerenderizações em excesso',
    ],
  },
];

const Slides = ({ match }) => {
  const { id } = match.params;
  const slide = content[id - 1];

  return (
    <div className="slide">
      {slide.content || (
        <>
          <h2>{slide.title}</h2>
          <ul>
            {slide.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Slides;
