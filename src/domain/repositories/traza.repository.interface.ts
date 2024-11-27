export interface ITrazaRepository {
    updateLastLogout(userId: string): Promise<void>;
}
