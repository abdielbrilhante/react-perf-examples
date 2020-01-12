import React from 'react';
import { format } from 'date-fns';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

import useFetch from '../helpers/useFetch';
import Loading from '../helpers/Loading';

const formatPhone = (phone) => parsePhoneNumberFromString(`+${phone}`).formatNational();

// This is our memoizable component. React _will_ re-render this when the parent component does, but
// we really only want that in case our props change.
const RowData = ({ data, checked, onChange }) => (
  <tr>
    {/* Using the last parameter used in React.memo we can further customize update frequency */}
    <td>
      <input
        type="checkbox"
        checked={checked}
        disabled={!onChange}
        onChange={() => onChange(data.id)}
      />
    </td>
    <td>{data.id}</td>
    <td>{data.customer.email}</td>
    <td>{formatPhone(data.customer.primaryPhone)}</td>
    <td>{formatPhone(data.customer.secondaryPhone)}</td>
    <td>{format(new Date(data.date), 'MM/dd')}</td>
    <td><span className="status">{data.status}</span></td>
  </tr>
);

// Non-memoized version of our component - it should re-render a few times.
const RowComponent = RowData;

// Memoized version - it should only update if/when its props change.
// const RowComponent = React.memo(RowData);

// Bonus example - here we customize our `should it rerender?` logic by passing a function to memo;
// with this we wouldn't really need React.useCallback
// const RowComponent = React.memo(RowData, (prevProps, nextProps) => {
//   return prevProps.checked === nextProps.checked && prevProps.data === nextProps.data;
// });

// This is the parent component, the one that holds state and/or passes the props down to its
// child components, including RowData/RowComponent.
const ReactMemo = () => {
  const {data, loading} = useFetch('/reservations?_limit=2000');

  const [selected, setSelected] = React.useState([]);

  const onChange = (id) => {
    setSelected((previous) =>
      previous.includes(id)
        ? previous.filter((_id) => _id !== id)
        : previous.concat(id),
    );
  };

  const checked = (id) => selected.includes(id);

  if (loading) {
    return <Loading />;
  }

  const result = (
    <div className="container">
      <table cellSpacing="0">
        <thead>
          <tr>
            <th />
            <th>#</th>
            <th>Customer email</th>
            <th>Primary phone</th>
            <th>Secondary phone</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <RowComponent
              key={item.id}
              checked={checked(item.id)}
              onChange={onChange}
              data={item}
            />
          ))}
        </tbody>
      </table>
    </div>
  );

  return result;
};

export default ReactMemo;
