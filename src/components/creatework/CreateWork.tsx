import { parseISO } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';
import {
  ChangeEventHandler,
  FormEventHandler,
  useCallback,
  useState
} from 'react';
import { Button } from "react-bootstrap";


const formatInTimeZone = (date: Date, fmt: string, tz: string) =>
  format(utcToZonedTime(date, tz), fmt, { timeZone: tz });

function defaultDate() {
  const date = new Date();
  const coeff = 1000 * 60 * 60 * 24;
  const rounded = new Date(Math.round(date.getTime() / coeff + 1) * coeff);
  return rounded;
}

function defaultTime() {
  const rounded = defaultDate();
  const out = `${format(rounded, 'yyyy-MM-dd')}T${format(rounded, 'kk:mm')}`;
  console.log('default date', out);
  return out;
}

export const CreateWork = () => {
  // auth context here
  const user = { address: 'stars1up88jtqzzulr6z72cq6uulw9yx6uau6ew0zegy' };
  const [projectName, setProjectName] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [projectSize, setProjectSize] = useState<number>(1);
  const [startDate, setStartDate] = useState<Date>(defaultDate());
  const [royaltyAddress, setRoyaltyAddress] = useState<string>(user.address);
  const [royaltyPercent, setRoyaltyPercent] = useState<number>(5);
  const onDateChange: ChangeEventHandler<HTMLInputElement> = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const parsed = parseISO(e.target.value); // , 'yyyy-LL-dd', new Date()
    console.log('actual date', e.target.value, 'parsed date', parsed);
    const date = parsed;
    // date = setYear(date, parsed.getFullYear());
    // date = setMonth(date, parsed.getMonth());
    // date = setDay(date, parsed.getDate());
    setStartDate(date);
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();
      // create project in api
      // create contract
    },
    [
      projectName,
      projectSize,
      projectDescription,
      startDate,
      royaltyAddress,
      royaltyPercent
    ]
  );

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label className={'block'}>
          <span className='text-gray-700'>Project Title</span>
          <input
            type={'text'}
            className={'form-input mt-1 block w-full'}
            placeholder='My Project'
            name='project_name'
            onChange={(e) => setProjectName(e.target.value)}
          />
        </label>
        <label className={'block'}>
          <span className='text-gray-700'>Description</span>
          <textarea
            rows={3}
            className={'form-textarea mt-1 block h-24 w-full'}
            placeholder='My Project is...'
            name='project_description'
            onChange={(e) => setProjectDescription(e.target.value)}
          />
        </label>
        <label className={'block'}>
          <span className={'text-gray-700'}>Collection Size (number)</span>
          <input
            type={'number'}
            max={10_000}
            min={1}
            defaultValue={1}
            name='project_collection_size'
            className={'form-input mt-1 block w-full'}
            onChange={(e) => setProjectSize(parseInt(e.target.value, 10) || 1)}
          />
        </label>

        <label className={'block'}>
          <span className={'text-gray-700'}>Start Date</span>
          <input
            type={'datetime-local'}
            defaultValue={defaultTime()}
            className={'form-input mt-1 block w-full'}
            name='project_public_start_time'
            onChange={onDateChange}
          />
          <span className={'text-gray-700'}>{`${format(
            startDate,
            'LLLL d, yyyy kk:mm',
            {
              timeZone: 'UTC'
            }
          )} UTC`}</span>
        </label>

        <label className={'block'}>
          <span className='text-gray-700'>Royalty Receiver</span>
          <input
            type={'text'}
            className={'form-input mt-1 block w-full'}
            placeholder={user.address}
            name='project_royalty_address'
            onChange={(e) => setRoyaltyAddress(e.target.value)}
          />
        </label>

        <label className={'block'}>
          <span className={'text-gray-700'}>Royalty Percentage</span>
          <input
            type={'number'}
            max={100}
            min={0}
            defaultValue={1}
            className={'form-input mt-1 block w-full'}
            name='project_royalty_percentage'
            onChange={(e) => setRoyaltyPercent(parseFloat(e.target.value) || 1)}
          />
        </label>

        <Button type={'submit'}>Save Changes</Button>
      </form>
    </div>
  );
};
