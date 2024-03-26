import React, { useEffect, useRef, useState, useCallback } from 'react';
// import Chart from '../Chart';
// import { FedChart } from './FedChart';
import { BarChart } from 'chartist';
import classnames from 'classnames';
import { data, keys } from './data/federalism-data-proc';
import { options, responsiveOptions, onDrawHandler } from './fed-options';
import { Container, Row, Col } from 'reactstrap';
import 'chartist/dist/index.css';
import './index.css';

const Federalism = (props) => {
  const dataRefs = useRef([]);
  const scrollRef = useRef();

  const [activeKeys, setActiveKeys] = useState([0]);
  const [currKey, setCurrKey] = useState(null);
  const visibleClass = 'visible';
  const animateClass = 'animate';

  const initialView = () => {
    toggleKeys(0);
  };

  const toggleKeys = (key) => {
    if (activeKeys) {
      if (!activeKeys.includes(key)) {
        setActiveKeys([...activeKeys, key]);
        setCurrKey(key);
      } else {
        setActiveKeys([...activeKeys].filter((item) => item !== key));
        setCurrKey(null);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('load', initialView);
    window.addEventListener('resize', initialView);
    return () => {
      window.removeEventListener('load', initialView);
      window.removeEventListener('resize', setActiveKeys);
    };
  });

  useEffect(() => {
    const els = dataRefs.current;
    console.log(els);
    els.map((item, i) => {
      return [
        activeKeys.includes(i)
          ? item.classList.add(visibleClass)
          : item.classList.remove(visibleClass),
        item.classList.remove(animateClass),

        currKey === i
          ? item.classList.add(animateClass)
          : item.classList.remove(animateClass),
      ];
    });
  }, [activeKeys, currKey]);

  const chart = useCallback(() => {
    return new BarChart('#chart', data, options, responsiveOptions);
  }, []);
  useEffect(() => {
    if (chart.current === undefined) return;
    //chart();
    chart().on('draw', () => onDrawHandler(data, dataRefs));
  }, [chart]);

  return (
    <div className={`federalism`} ref={scrollRef}>
      <section>
        <Container>
          <h2 className={`text-center py-2`}> Federal Support for States</h2>
          <div id="chart" ref={chart}></div>
        </Container>
        <Container className="legend-wrap">
          <h5 className="text-center">
            Select Categories Below to Explore the Support the Federal Gov't
            Provides to the States
          </h5>
          <Row className="">
            {keys.map((key, i) => {
              return (
                <Col className="key-wrap" key={key} sm={6} lg={2}>
                  <button
                    key={`k${i}`}
                    data-index={i}
                    onClick={() => toggleKeys(i)}
                    className={classnames(`key key-${i}`)}>
                    <i
                      className={classnames(
                        `${key.toLowerCase().replace(/\s/g, '-')}`,
                        activeKeys.includes(i) ? 'on' : ''
                      )}
                      key={`${i}`}></i>
                    {key}
                  </button>
                </Col>
              );
            })}
          </Row>
          <small className="source text-center">
            Source:{' '}
            <a href="https://www.whitehouse.gov/omb/historical-tables/">
              Whitehouse Historical Tables
            </a>
          </small>
        </Container>
      </section>
    </div>
  );
};

export default Federalism;
