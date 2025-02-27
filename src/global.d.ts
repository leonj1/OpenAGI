/**
 * Global type declarations for the application
 */

declare global {
  /**
   * Application version and build information
   */
  const MACRO: {
    /** Application version string */
    VERSION: string;
    /** Build identifier (commit hash, etc.) */
    BUILD: string;
    /** Build timestamp */
    BUILD_DATE: string;
    /** Package URL for updates */
    PACKAGE_URL: string;
  };
} 