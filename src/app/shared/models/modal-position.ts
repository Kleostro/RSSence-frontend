import MODAL_POSITION_DIRECTION from '@/app/shared/constants/modal-position';

type ModalPositionType = (typeof MODAL_POSITION_DIRECTION)[keyof typeof MODAL_POSITION_DIRECTION];

export default ModalPositionType;
