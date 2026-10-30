// Stand-in for a SQL client. Records every query so behavior can be inspected.
export const db = {
  calls: [],
  query(sql, params = []) {
    this.calls.push({ sql, params });
    return [];
  }
};
