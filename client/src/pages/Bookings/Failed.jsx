import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { useHistory } from 'react-router-dom';
import api from '../../api';
import { useStore } from '../../utilities/store';
import { formatDate } from '../../utilities/datetime';
import SecondaryInfo from './Components/SecondaryInfo';

const Failed = () => {
  const [allBids, setAllBids] = useState([]);
  const store = useStore();
  const history = useHistory();

  useEffect(() => {
    api.bids.getPetOwnerBids(store.user.username).then((x) => setAllBids(x));
  }, [store.user.username]);

  console.log(allBids);

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
                <ListItem 
                  alignItems="flex-start"
                  button
                  onClick={() => history.push(`/profile/${bids.caretakerusername}`)}
                >
                  <ListItemIcon>
                    <PersonIcon color="primary" fontSize="large" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography component="span" variant="h3" color="Primary">
                        {`${bids.petname}`}
                      </Typography>
                    }
                    secondary={
                      <>
                        <SecondaryInfo label="Caretaker: " content={bids.caretakerusername} />
                        <br />
                        <SecondaryInfo label="Start Date: " content={formatDate(bids.startdate)} />
                        <br />
                        <SecondaryInfo label="End Date: " content={formatDate(bids.enddate)} />
                        <br />
                        <SecondaryInfo label="Transfer Type: " content={bids.transfertype} />
                        <br />
                        <SecondaryInfo label="Remarks: " content={bids.remarks} />
                        <br />
                        <SecondaryInfo label="Total Amount: " content={`$${bids.totalamount}`} />
                      </>
                    }
                  />
                </ListItem>
              </Paper>
            );
          })}
      </List>
    </>
  );
};

export default Failed;
