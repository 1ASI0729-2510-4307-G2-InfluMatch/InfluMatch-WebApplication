export type CollaborationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELED' | 'FINISHED';

export class CollaborationStatusUtils {
  static getStatusColor(status: CollaborationStatus): string {
    switch (status) {
      case 'PENDING': return 'warn';
      case 'ACCEPTED': return 'primary';
      case 'REJECTED': return 'accent';
      case 'CANCELED': return 'accent';
      case 'FINISHED': return 'primary';
      default: return 'primary';
    }
  }

  static getStatusIcon(status: CollaborationStatus): string {
    switch (status) {
      case 'PENDING': return 'schedule';
      case 'ACCEPTED': return 'check_circle';
      case 'REJECTED': return 'cancel';
      case 'CANCELED': return 'cancel';
      case 'FINISHED': return 'done_all';
      default: return 'help';
    }
  }

  static getStatusLabel(status: CollaborationStatus): string {
    return `COLLABORATIONS.STATUS.${status}`;
  }

  static isActionableStatus(status: CollaborationStatus): boolean {
    return status === 'PENDING' || status === 'ACCEPTED';
  }

  static getAvailableActions(status: CollaborationStatus, userRole: 'RECIPIENT' | 'INITIATOR'): string[] {
    if (status === 'PENDING') {
      if (userRole === 'RECIPIENT') {
        return ['ACCEPT', 'REJECT'];
      } else if (userRole === 'INITIATOR') {
        return ['CANCEL'];
      }
    } else if (status === 'ACCEPTED' && userRole === 'INITIATOR') {
      return ['FINISH'];
    }
    return [];
  }
} 