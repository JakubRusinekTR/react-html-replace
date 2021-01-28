/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { render } from 'react-dom';

import reactHtmlReplace from '../../src';

const Mention = props => {
  const { children, id, name } = props;
  return (
    <span name={name} id={id} style={{ border: '1px solid #ccc' }}>
      &nbsp;{children}&nbsp;
    </span>
  );
};

class Demo extends Component {
  render() {

    const rendered = reactHtmlReplace(
      '<italic>This is <bold>xml string</bold> with custom nested markup, <bold>we can get inner markup & attributes through props.</bold></italic> <mention id="123" name="raodurgesh">this is mention tag with id & name attributes</mention> <hashtag tag="howdymody" href="http://google.com"></hashtag>',
      (tag, props) => {
        if (tag === 'bold') {
          return <b />;
        }
        if (tag === 'italic') {
          return <i />;
        }
        if (tag === 'br') {
          return <br />;
        }
        if (tag === 'mention') {
          const { name, id } = props;
          return <Mention name={name} id={id} />;
        }
        if (tag === 'hashtag') {
          const { tag, href } = props;
          return <a href={href}>{`#${tag}`}</a>;
        }
      }
    );

    return (
      <div>
        {rendered}
      </div>
    );
  }
}

render(<Demo />, document.querySelector('#demo'));
