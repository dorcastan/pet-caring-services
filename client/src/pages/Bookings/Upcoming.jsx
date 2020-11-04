import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon
} from '@material-ui/core';
import PetsIcon from '@material-ui/icons/Pets';
import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { useHistory } from 'react-router-dom';
import api from '../../api';
import { useStore } from '../../utilities/store';
import SelectPaymentMethod from './Components/selectPaymentMethod';
import { useSnackbarContext } from '../../utilities/snackbar';

const moment = require('moment');

const Upcoming = () => {
  const [allBids, setAllBids] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState();
  const [paymentMethodOptions, setPaymentMethodOptions] = useState([]);
  const store = useStore();
  const history = useHistory();
  const showSnackbar = useSnackbarContext();

  useEffect(() => {
    api.bids.getPetOwnerBids(store.user.username).then((x) => setAllBids(x));
    api.paymentMethod.getPaymentMethods().then((x) => setPaymentMethodOptions(x));
  }, [store.user.username]);

  console.log(paymentMethod);

  console.log(`all bids${allBids}`);

  const handleClick = async (bidPaymentMethod, bid) => {
    try {
      const body = {
        petName: bid.petname,
        petOwnerUsername: bid.petownerusername,
        caretakerUsername: bid.caretakerusername,
        submittedAt: moment(bid.submittedat).format('YYYY-MM-DD HH:mm:ss.SSS'),
        startDate: bid.start,
        endDate: bid.end,
        status: bid.status,
        transactionDateTime: moment.utc(moment(), 'YYYY-MM-DD HH:mm:ss.SSS'),
        paymentMethod: bidPaymentMethod,
        totalAmount: null,
        rating: null,
        comment: null,
        reviewDateTime: null,
      };
      await showSnackbar(api.bids.updateBids(body));
    } catch (err) {
      console.log(`err${err.message}`);
    }
  };

  return (
    <>
      <Paper style={{ margin: 30, padding: 30 }}>
        <Typography>{'Status: Accepted'}</Typography>
      </Paper>
      <List>
        {allBids
          .filter((bids) => bids.status === 'Accepted')
          .map((bids) => {
            return (
              <Paper style={{ margin: 30, padding: 30 }} key={bids.id}>
                <ListItem 
                  alignItems="flex-start"
                  button
                  onClick={() => history.push(`/profile/${bids.caretakerusername}`)}
                >
                  <ListItemIcon>
                    <PetsIcon color="primary" fontSize="large" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography component="span" variant="h3" color="Primary">
                        {`${bids.petname}`}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="textPrimary">
                          {`Caretaker: `}
                        </Typography>
                        {`${bids.caretakerusername}`}
                      </>
                    }
                  />
                  <ListItemText />
                  <ListItemSecondaryAction>
                    <SelectPaymentMethod
                      paymentMethodOptions={paymentMethodOptions}
                      setPaymentMethod={setPaymentMethod}
                      handleUpdateBid={handleClick}
                      bids={bids}
                      isDisabled={bids.transactiondatetime}
                    />
                    {/* <Button
                      size="small"
                      
                      disabled={bids.transactiondatetime}
                      onClick={() => {
                        handleClick(bids);
                      }}
                    > */}
                    {/* {'Choose Payment Method'} */}
                    {/* </Button> */}
                  </ListItemSecondaryAction>
                </ListItem>
              </Paper>
            );
          })}
      </List>
    </>
  );
};

export default Upcoming;