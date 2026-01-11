import * as React from 'react';
import { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { API_URL } from '../../../../api';

import { useAnimate } from '@mui/x-charts/hooks';
import { interpolateObject } from '@mui/x-charts-vendor/d3-interpolate';

/* =========================
   WHITE LABEL STYLE
========================= */
const WhiteLabel = styled('text')(() => ({
  fill: '#fff',
  fontWeight: 600,
  fontSize: 12,
  dominantBaseline: 'central',
  pointerEvents: 'none',
}));

/* =========================
   CUSTOM BAR LABEL (LEFT)
========================= */
function BarLabelInsideLeft(props) {
  const { xOrigin, y, height, value, skipAnimation } = props;

  const animatedProps = useAnimate(
    { x: xOrigin + 8, y: y + height / 2 },
    {
      initialProps: { x: xOrigin + 2, y: y + height / 2 },
      createInterpolator: interpolateObject,
      skip: skipAnimation,
    }
  );

  return (
    <WhiteLabel {...animatedProps}>
      {value}%
    </WhiteLabel>
  );
}

/* =========================
   MAIN COMPONENT
========================= */
export default function UserProgressChart() {
  const [progress, setProgress] = useState([]);

  /* ===== FETCH DATA ===== */
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.post(
          `${API_URL}/admin/23/excelrender`, {},
          { withCredentials: true }
        );
        setProgress(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProgress();
  }, []);

  /* ===== AGGREGATE PER USER ===== */
  function getCompletionPercentagePerUser(data) {
    const users = {};

    data.forEach(item => {
      if (!users[item.user_id]) {
        users[item.user_id] = {
          name: `${item.first_name} ${item.surname}`,
          total: 0,
          done: 0,
        };
      }

      users[item.user_id].total += 1;
      if (item.is_done) users[item.user_id].done += 1;
    });

    return Object.values(users).map(u => ({
      name: u.name,
      percentage: Math.round((u.done / u.total) * 100),
      done: u.done,
      remaining: u.total - u.done,
    }));
  }

  const chartData = getCompletionPercentagePerUser(progress);

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="w-10/12">
      <Box width="100%">
        <Typography mb={2} fontWeight={600}>
          User Progress Statistics
        </Typography>

        <BarChart
        height={260}
        dataset={chartData}
        layout="horizontal"

        series={[
            {
            dataKey: 'percentage',
            label: 'Completion %',
            valueFormatter: (v) => `${v}%`,
            barLabel: (v) => `${v.value}%`,
            },
            {
            dataKey: 'done',
            label: 'Completed',
            },
            {
            dataKey: 'remaining',
            label: 'Remaining',
            },
        ]}

        yAxis={[
            {
            scaleType: 'band',
            dataKey: 'name',
            width: 180,
            },
        ]}

        xAxis={[
            {
            min: 0,
            max: 100,
            valueFormatter: (v) => `${v}%`,
            },
        ]}

        /* ✅ DITO LANG TALAGA GUMAGANA */
        slotProps={{
            barLabel: {
            sx: {
                fill: '#ffffff',      // ✅ WHITE TEXT
                fontWeight: 700,
                fontSize: 12,
                dominantBaseline: 'left',
                textAnchor: 'start',
                transform: 'translate(8px, 0)', // 👈 KALIWANG LOOB
            },
            },
        }}
        />

      </Box>
    </div>
  );
}
