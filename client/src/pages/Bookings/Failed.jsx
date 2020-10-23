import {
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import api from '../../api';
import { useStore } from '../../utilities/store';

const Upcoming = () => {
  const [allBids, setAllBids] = useState([]);
  const [rating, setRating] = React.useState(2);
  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const store = useStore();

  useEffect(() => {
    api.bids.getPetOwnerBids(store.user.username).then((x) => setAllBids(x));
  }, [store.user.username]);

  console.log(`all bids${allBids}`);

  return (
    <>
      <Paper style={{ margin: 30, padding: 30 }}>
        <Typography>{'Status: Expired/Rejected'}</Typography>
      </Paper>
      <List>
        {allBids
          .filter((bids) => bids.status === 'Expired' || bids.status === 'Rejected')
          .map((bids) => {
            return (
              <Paper style={{ margin: 30, padding: 30 }} key={bids.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={`${bids.caretakerusername}`}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          // className={classes.inline}
                          color="textPrimary"
                        >
                          {`Secondary text `}
                        </Typography>
                        {`Secondary`}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Button
                      onClick={() => {
                        console.log(bids.id);
                      }}
                    >
                      {'BOOK ME'}
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

export default Upcoming;