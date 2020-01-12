import React from 'react';
import { throttle } from 'lodash';
import { format } from 'date-fns';

import useFetch from '../helpers/useFetch';
import Loading from '../helpers/Loading';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const formatPhone = (phone) => parsePhoneNumberFromString(`+${phone}`).formatNational();

// This is the parent component, the one that holds state and/or passes the props down to its
// child components, including RowData/RowComponent.
const Virtualization = () => {
  const container = React.useRef();
  const {data, loading} = useFetch('/reservations?_limit=400');

  const [edges, setEdges] = React.useState(null);

  // This is our "virtualizer" function. It gets the interval of visible item indexes, and sets
  // an expanded interval in our state. So if 20 items are visible, those items, as well as the 20
  // before and the 20 after them are set as visible. All the other items will be rendered as an
  // invisible item.
  const setVisibleItems = React.useCallback(throttle(() => {
    if (!container.current) {
      return;
    }

    const first = container.current.querySelector('.card');
    const rect = first.getBoundingClientRect();

    const actualHeight = rect.height + 24;
    const upperLimit = Math.floor(Math.max(0, -rect.top / actualHeight));
    const visibleItems = Math.ceil(document.documentElement.clientHeight / actualHeight) - 1;

    setEdges([
      Math.max(0, upperLimit - (2 * visibleItems)),
      upperLimit + (3 * visibleItems),
    ]);
  }, 300), []);

  // We set the visible items in the beggining as well as when the user scrolls or the window
  // dimensions change.
  React.useEffect(() => {
    setVisibleItems();

    document.addEventListener('resize', setVisibleItems);
    document.addEventListener('scroll', setVisibleItems);

    return () => {
      document.removeEventListener('resize', setVisibleItems);
      document.removeEventListener('scroll', setVisibleItems);
    };
  }, [data]);

  // With this we ignore the virtualization logic
  const isVisible = () => true;

  // Using this function we'll limit the amount of fully rendered items
  // const isVisible = (index) => edges && index >= edges[0] && index <= edges[1];

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container" ref={container}>
      <div className="list">
        {data.map((item, index) => !isVisible(index) ? (
          <div key={item.id} className="card" />
        ) : (
          <div key={item.id} className="card">
            <div className="title">
              Reservation #{item.id} <span className="status">{item.status}</span>
            </div>
            <div className="date">Made at {format(new Date(), 'MM/dd')}</div>
            <div>
              <b>Customer phone:</b> {formatPhone(item.customer.primaryPhone)}
            </div>
            <div>
              <b>Manager phone:</b> {formatPhone(item.room.location.manager.primaryPhone)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Virtualization;
