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
        caughtBy = 'window global error handler';
        const { filename, lineno, colno } = error as ErrorEvent;
        additionalInformation = (
          <small>
            in {filename}@{lineno}:{colno}
          </small>
        );
      } else {
        additionalInformation = <pre>{JSON.stringify(error, null, 2)}</pre>;
      }
      return (
        <div>
          <h1>Something went wrong.</h1>
          Here is a technical summary of the error caught by <i>{caughtBy}</i>:
          <br />
          <br />
          <b>{error.message}</b>
          <br />
          {additionalInformation}
          <br />
          <br />
          <button onClick={() => window.location.reload()}>Reload page</button>
          &nbsp;
          <button onClick={() => (window.location.href = '/')}>
            Back to home page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
