import React from 'react';
import { get, sortBy } from 'lodash';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { format } from 'date-fns';

import Loading from '../helpers/Loading';
import useFetch from '../helpers/useFetch';

// This is our costly function. Costly operations could be in many places, even coupled with the
// render logic, and those operations have been extracted into a single function for the purposes of
// this example. Extra info: here, phone number formatting represents the biggest performance hit.
const getInitialState = (data) => {
  const items = data || [];

  const formatUser = (user) => ({
    name: `${user.firstName} ${user.lastName}`,
    primaryPhone: parsePhoneNumberFromString(`+${user.primaryPhone}`).formatNational(),
    secondaryPhone: parsePhoneNumberFromString(`+${user.secondaryPhone}`).formatNational(),
    email: user.email,
  });

  return items.map((item) => {
    const { discount, customer, date, room } = item;
    let price = room.price;

    if (discount) {
      if (discount.type === 'percent') {
        price = (price * (100 - discount.value)) / 100;
      } else {
        price = price - discount.value;
      }
    }

    return {
      ...item,
      customer: formatUser(customer),
      date: format(new Date(date), 'MM/dd/yyyy'),
      price,
      room: {
        ...room,
        location: {
          ...room.location,
          manager: formatUser(room.location.manager),
        },
      },
    };
  });
};

const paymentOptions = {
  visa: 'VISA',
  master: 'MasterCard',
  check: 'Check',
  cash: 'Cash',
};

const sortResults = (items, key) => sortBy(items, (item) => get(item, key));

const UseMemo = () => {
  // Fetch the actual data from the API.
  // This could be Apollo's useQuery, a Redux dispatch, or really anything that lets you fetch data;
  // the point is: once fetched, the data is not being mutated (in this case it's a custom hook
  // that uses the Fetch API and stores it in internal state).
  const { data, loading } = useFetch('/reservations?_limit=2000');

  // This is the bottleneck: our getInitialState function is _really_ costly
  const reservations = getInitialState(data);

  // This is the memoized version of the above. Our memoized data will _only_ be updated if/when the
  // state (fetched) data changes, and so other renders do not run the costly processing function
  // unless it's actually needed.
  // const reservations = React.useMemo(() => getInitialState(data), [data]);

  // This is extra internal state: it tracks which column currently sorts our rows. Every update
  // to this state will cause a re-render, but even this sort operation can be memoized.
  const [sortBy, setSortBy] = React.useState('id');
  const list = sortResults(reservations, sortBy);

  if (loading) {
    return <Loading />;
  }

  const handleHeaderClick = (key) => () => {
    setSortBy(key);
  };

  return (
    <div className="container">
      <table cellSpacing="0">
        <thead>
          <tr>
            <th onClick={handleHeaderClick('id')}>#</th>
            <th onClick={handleHeaderClick('date')}>Date</th>
            <th onClick={handleHeaderClick('customer.name')}>Customer</th>
            <th onClick={handleHeaderClick('customer.email')}>Email</th>
            <th onClick={handleHeaderClick('customer.primaryPhone')}>Primary Phone</th>
            <th onClick={handleHeaderClick('customer.secondaryPhone')}>Secondary Phone</th>
            <th onClick={handleHeaderClick('paymentOption')}>Payment Option</th>
            <th onClick={handleHeaderClick('status')}>Status</th>
          </tr>
        </thead>
        <tbody>
          {list.map((reservation) => (
            <tr key={reservation.id}>
              <td>{reservation.id}</td>
              <td>{format(new Date(reservation.date), 'MM/dd')}</td>
              <td>{reservation.customer.name}</td>
              <td>{reservation.customer.email}</td>
              <td>{reservation.customer.primaryPhone}</td>
              <td>{reservation.customer.secondaryPhone}</td>
              <td>{paymentOptions[reservation.paymentOption]}</td>
              <td><span className="status">{reservation.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UseMemo;
