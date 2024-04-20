import { UserIcon } from 'lucide-react';

export default function MemberPage() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className=" rounded-md p-5 shadow-lg">
        <div className="flex flex-col">
          <div className="text-lg font-bold">Over view</div>
        </div>

        <div className="flex justify-between py-3">
          <div className="flex items-center justify-center gap-2">
            <UserIcon />

            <div className="flex flex-col">
              <div className="font-bold">35</div>
              <div>Members</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <UserIcon />

            <div className="flex flex-col">
              <div className="font-bold">35</div>
              <div>Members</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <UserIcon />

            <div className="flex flex-col">
              <div className="font-bold">35</div>
              <div>Members</div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-32 rounded-md shadow-lg"></div>

      <div className="h-96 rounded-md shadow-lg"></div>

      <div className="h-96 rounded-md shadow-lg"></div>
    </div>
  );
}
