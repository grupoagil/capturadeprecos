import React from 'react';

import { Container, Filler } from './styles';

const ProgressBar = ({ completed, ...rest }) => (
    <Container {...rest}>
        <Filler completed={completed} />
    </Container>
);


export default ProgressBar;