import React from 'react';

type ErrorBoundaryProps = React.PropsWithChildren<{}>;

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  { error: Error | ErrorEvent | undefined }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: undefined };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  componentDidMount() {
    window.addEventListener('error', (event) => {
      this.setState({ error: event });
    });
  }

  // todo: report error to server?
  // componentDidCatch(error, errorInfo) {}

  render() {
    if (this.state.error) {
      let caughtBy = 'React error boundary';
      let additionalInformation;
      let error = this.state.error;
      if ('lineno' in error) {
        error = error.error;
        caughtBy = 'window global error handler';
        const { type, filename, lineno, colno } = error as ErrorEvent;
        additionalInformation = (
          <small>
            {type} in {filename}@{lineno}:{colno}
          </small>
        );
      }
      return (
        <div>
          <h1>Something went wrong.</h1>
          Here is a technical summary of the error caught by <i>{caughtBy}</i>:
          <pre>{JSON.stringify(error, null, 2)}</pre>
          {additionalInformation}
        </div>
      );
    }
    return this.props.children;
  }
}
