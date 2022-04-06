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

  static getDerivedStateFromError({ name, stack, message }: Error) {
    // Update state so the next render will show the fallback UI.
    return { error: { name, stack, message } };
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
          <>
            <small>
              in {filename}@{lineno}:{colno}
            </small>

            <br />
            <br />
          </>
        );
      }
      return (
        <div>
          <h1>Something went wrong.</h1>
          <button onClick={() => window.location.reload()}>Reload page</button>
          &nbsp;
          <button onClick={() => (window.location.href = '/')}>
            Back to home page
          </button>
          <br />
          <br />
          Here is a technical summary of the error caught by <i>{caughtBy}</i>:
          <br />
          <br />
          <b>{error.message}</b>
          <br />
          {additionalInformation}
          <pre style={{ maxWidth: '100%', overflowX: 'auto' }}>
            {'error' in error ? error.error.stack : error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
