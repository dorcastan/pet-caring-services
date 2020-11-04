import {
  Button,
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
import { useSnackbarContext } from '../../utilities/snackbar';

const moment = require('moment');

const Pending = () => {
  const [bids, setBids] = useState([]);
  const store = useStore();
  const history = useHistory();
  const showSnackbar = useSnackbarContext();

  useEffect(() => {
    api.bids.getCaretakerBids(store.user.username).then((x) => setBids(x));
  }, [store.user.username]);

  const handleClick = async (status, bid) => {
    try {
      const body = {
        petName: bid.petname,
        petOwnerUsername: bid.petownerusername,
        caretakerUsername: bid.caretakerusername,
        submittedAt: moment(bid.submittedat).format('YYYY-MM-DD HH:mm:ss.SSS'),
        startDate: bid.start,
        endDate: bid.end,
        status,
        transactionDateTime: null,
        paymentMethod: null,
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
        <Typography>{'Status: Pending'}</Typography>
      </Paper>
      <List>
        {bids
          .filter((bid) => bid.status === 'Pending')
          .map((bid) => {
            return (
              <Paper style={{ margin: 30, padding: 30 }} key={bids.id}>
                <ListItem 
                  alignItems="flex-start"
                  button
                  onClick={() => history.push(`/pet-owners/${bid.petownerusername}/pets/${bid.petname}`)}
                >
                  <ListItemIcon>
                    <PetsIcon color="primary" fontSize="large" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography component="span" variant="h3" color="Primary">
                        {`${bid.petname}`}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="textPrimary">
                          {`Pet Owner: `}
                        </Typography>
                        {`${bid.petownerusername}`}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        handleClick('Accepted', bid);
                      }}
                    >
                      {'Accept'}
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        handleClick('Rejected', bid);
                      }}
                    >
                      {'Reject'}
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              </Paper>
            );
          })}
      </List>
    </>
  );
};

export default Pending;
