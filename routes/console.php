<?php

Schedule::command('folders:check-deadlines')->dailyAt('05:30');
Schedule::command('reports:send-scheduled')->everyMinute();
