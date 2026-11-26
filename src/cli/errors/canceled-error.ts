export class CanceledError extends Error {
  constructor(message = 'Operation canceled') {
    super(message);
    this.name = 'CanceledError';
  }
}