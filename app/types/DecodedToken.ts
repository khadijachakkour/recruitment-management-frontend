export interface DecodedToken {
    sub?: string;
    realm_access: {
      roles: string[];
    };
    candidatId?: string;
  }