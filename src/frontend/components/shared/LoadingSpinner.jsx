import styled from 'styled-components';

const SpinnerContainer = styled.div`
  display: inline-block;
  position: relative;
  width: ${props => props.size || '80px'};
  height: ${props => props.size || '80px'};
`;

const SpinnerCircle = styled.div`
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: ${props => `calc(${props.size || '80px'} - 8px)`};
  height: ${props => `calc(${props.size || '80px'} - 8px)`};
  margin: 4px;
  border: 4px solid ${props => props.color || '#2a4365'};
  border-radius: 50%;
  animation: spinner-rotate 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: ${props => props.color || '#2a4365'} transparent transparent transparent;

  &:nth-child(1) {
    animation-delay: -0.45s;
  }
  &:nth-child(2) {
    animation-delay: -0.3s;
  }
  &:nth-child(3) {
    animation-delay: -0.15s;
  }

  @keyframes spinner-rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  margin-top: 16px;
  color: ${props => props.textColor || '#4a5568'};
  font-size: ${props => props.textSize || '1rem'};
  text-align: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: ${props => props.fullHeight ? '100vh' : 'auto'};
  padding: ${props => props.fullHeight ? '0' : '2rem'};
`;

export default function LoadingSpinner({
    size = '80px',
    color = '#2a4365',
    text = 'Carregando...',
    textColor = '#4a5568',
    textSize = '1rem',
    fullHeight = false
}) {
    return (
        <Wrapper fullHeight={fullHeight}>
            <SpinnerContainer size={size}>
                <SpinnerCircle size={size} color={color} />
                <SpinnerCircle size={size} color={color} />
                <SpinnerCircle size={size} color={color} />
                <SpinnerCircle size={size} color={color} />
            </SpinnerContainer>
            {text && <LoadingText textColor={textColor} textSize={textSize}>{text}</LoadingText>}
        </Wrapper>
    );
}