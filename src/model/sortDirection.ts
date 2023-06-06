enum SortDirection {
    ascending,
    descending
}

const sortDirectionToSql = (sd: SortDirection): string => {
    switch (sd) {
        case SortDirection.ascending:
            return "ASC";
        case SortDirection.descending:
            return "DESC";
    }
}

export { SortDirection, sortDirectionToSql };
