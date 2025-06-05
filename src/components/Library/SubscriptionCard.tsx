import { type UserSubscription } from '@storage/schemas/userSubscription';
import { useSubscriptionData } from '@hooks/useSubscriptionData';
import { authState } from '@state/auth';
import createSubscription from '@storage/methods/subscriptions/createSubscription';
import { createSystem } from '@storage/methods/systems';
import createVersionedResource from '@storage/methods/versionedresources/createVersionedResource';
import { System } from '@storage/schemas/system';
import { VersionedResource } from '@storage/schemas/versionedResource';
import { useNavigate } from 'react-router';
import getVisualTextFromVersionID from '@utils/getVisualTextFromVersionID';
import JSONToFile from '@utils/JSONToFile';
import DropdownButton from '@components/DropdownButton';
import ConfirmModal from '@modals/ConfirmModal';

import { openModal } from '@state/modals'

type Props = {
  subscription: UserSubscription;
};

const forkSystem = async (baseData: System, versionData: VersionedResource) => {
  const newSys = await createSystem(baseData);

  if (!newSys) return;

  const newVers = await createVersionedResource(
    'system',
    newSys.local_id,
    versionData.data
  );

  // TODO: if this check fails we should cleanup the system we just made :)
  if (!newVers) return;

  const newSub = await createSubscription(
    'system',
    newSys.local_id,
    newVers.local_id,
    false
  );

  // TODO: if this check fails we should cleanup the system, and version we just made :)
  if (!newSub) return;
};

const SubscriptionCard: React.FC<Props> = ({ subscription }) => {
  const { query, isLoading } = useSubscriptionData(subscription);
  let navigate = useNavigate();

  const { user } = authState.useValue();

  if (isLoading || !query) return <></>;

  const { baseData, versionData } = query;

  // we are considered the owner if our user id's match or if the subscription doesn't have a user id and server provided id
  const isOwner =
    (user && baseData.user_id && user.id === baseData.user_id) ||
    (!user && baseData.user_id === 'none');

  return (
    <div
      key={subscription.local_id}
      className="relative flex flex-col max-w-96 p-4 transition-all duration-200 bg-white border rounded-xl hover:shadow-lg dark:bg-neutral-800 dark:border-neutral-700 hover:transform hover:scale-[1.02]"
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-brand-600 rounded-lg flex items-center justify-center">
          <span className="text-xl font-bold text-white">
            {baseData.name[0]}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h5 className="text-xl font-semibold text-neutral-900 truncate dark:text-white">
            {baseData.name}
          </h5>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Version {getVisualTextFromVersionID(versionData.local_id)}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center gap-2 mt-4 border-t pt-3 dark:border-neutral-700">
        <p>{new Date(versionData.created_at).toDateString()}</p>
        <DropdownButton label={isOwner ? 'Edit' : 'Fork'} onClick={() => {
            if (isOwner) {
              // direct to editor.
              return navigate(
                `/library/${subscription.resource_type}/${versionData.local_id}`
              );
            }

            // fork
            return forkSystem(baseData, versionData);
          }} options={[
            {
              label: 'Export',
              onClick: () => JSONToFile(
                {
                  system: query.baseData,
                  version: query.versionData,
                },
                `${query.baseData.name}-${query.versionData.local_id}`
              )
            },
            {
              label: 'Delete',
              onClick: () => openModal('delete-subscription', ({ id }) => <ConfirmModal id={id} title='Delete Subscription' type='danger' message='Are you sure you want to delete this subscription?' onConfirm={() => {}} />)
            }
          ]} />
      </div>
    </div>
  );
};

export default SubscriptionCard;

